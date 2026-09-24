import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { OAuth2Client } from 'google-auth-library';

import {
    User,
    UserDocument,
} from '../users/user.schema.js';

@Injectable()
export class AuthService {
    private readonly googleClient = new OAuth2Client();

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,

        private readonly jwtService: JwtService,

        private readonly configService: ConfigService,
    ) { }

    // ==========================================
    // REGISTER
    // ==========================================

    async register(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        if (password.length < 6) {
            throw new BadRequestException(
                'Password must contain at least 6 characters',
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const existingUser = await this.userModel.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            throw new ConflictException(
                'An account with this email already exists',
            );
        }

        const passwordHash = await bcrypt.hash(
            password,
            12,
        );

        const user = await this.userModel.create({
            email: normalizedEmail,
            passwordHash,
            providers: ['local'],
            onboardingCompleted: false,
        });

        return this.createAuthResponse(user);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    async login(email: string, password: string) {
        if (!email || !password) {
            throw new BadRequestException(
                'Email and password are required',
            );
        }

        const normalizedEmail = email
            .trim()
            .toLowerCase();

        const user = await this.userModel
            .findOne({
                email: normalizedEmail,
            })
            .select('+passwordHash');

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        const passwordMatches =
            await bcrypt.compare(
                password,
                user.passwordHash,
            );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }

        return this.createAuthResponse(user);
    }

    // ==========================================
    // GOOGLE LOGIN / REGISTRATION
    // ==========================================

    async googleLogin(idToken: string) {
        if (!idToken) {
            throw new BadRequestException(
                'Google ID token is required',
            );
        }

        const webClientId =
            this.configService.getOrThrow<string>(
                'GOOGLE_WEB_CLIENT_ID',
            );

        const ticket =
            await this.googleClient.verifyIdToken({
                idToken,
                audience: webClientId,
            });

        const payload = ticket.getPayload();

        if (
            !payload ||
            !payload.email ||
            !payload.sub
        ) {
            throw new UnauthorizedException(
                'Invalid Google account',
            );
        }

        if (!payload.email_verified) {
            throw new UnauthorizedException(
                'Google email is not verified',
            );
        }

        const email = payload.email.toLowerCase();

        let user = await this.userModel.findOne({
            $or: [
                {
                    googleId: payload.sub,
                },
                {
                    email,
                },
            ],
        });

        if (!user) {
            // First time Google user
            user = await this.userModel.create({
                email,
                googleId: payload.sub,
                name: payload.name ?? '',
                photo: payload.picture ?? '',
                providers: ['google'],
                onboardingCompleted: false,
            });
        } else {
            // Existing email account can also use Google
            user.googleId = payload.sub;

            if (payload.name) {
                user.name = payload.name;
            }

            if (payload.picture) {
                user.photo = payload.picture;
            }

            if (!user.providers.includes('google')) {
                user.providers.push('google');
            }

            await user.save();
        }

        return this.createAuthResponse(user);
    }

    // ==========================================
    // JWT RESPONSE
    // ==========================================

    private async createAuthResponse(
        user: UserDocument,
    ) {
        const accessToken =
            await this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
            });

        return {
            accessToken,

            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name ?? '',
                photo: user.photo ?? '',
                providers: user.providers,
                onboardingCompleted:
                    user.onboardingCompleted,
            },
        };
    }
}