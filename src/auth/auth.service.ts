// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  formModel: any;
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: any) {
    const { email, password, firstName, lastName } = signupDto;

    // Check if user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await user.save();

    return {
      message: 'User created successfully',
      _id: user._id,
    };
  }

  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 🔥 IMPORTANT: Create JWT payload with 'sub' field
    const payload = {
      sub: user._id.toString(), // ✅ Use 'sub' not 'userId'
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
  async updateProfile(userId: string, updateDto: any) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // Check if email is being changed and if it's already taken
  if (updateDto.email && updateDto.email !== user.email) {
    const existingUser = await this.userModel.findOne({ email: updateDto.email });
    if (existingUser) {
      throw new UnauthorizedException('Email already in use');
    }
  }

  user.firstName = updateDto.firstName || user.firstName;
  user.lastName = updateDto.lastName || user.lastName;
  user.email = updateDto.email || user.email;

  await user.save();

  return {
    message: 'Profile updated successfully',
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
}

async changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Current password is incorrect');
  }

  // Hash and save new password
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return { message: 'Password changed successfully' };
}

async updateEmailPreferences(userId: string, preferences: any) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  user.emailPreferences = preferences;
  await user.save();

  return { message: 'Email preferences updated successfully' };
}

async deleteAccount(userId: string) {
  // Delete all user's forms
  await this.formModel.deleteMany({ userId });
  
  // Delete user
  await this.userModel.findByIdAndDelete(userId);

  return { message: 'Account deleted successfully' };
}

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}