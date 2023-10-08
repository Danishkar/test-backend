import { Profile, ProfileType } from "../models/profileModel.js";
import {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../../config/envConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const refreshService = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET
    ) as jwt.JwtPayload;

    if (decoded.exp && Date.now() > decoded.exp * 1000) {
      return {
        statusCode: 401,
        message: "Token expired, please log in again",
        authStatus: false,
      };
    }

    const foundUser = await Profile.find({ _id: decoded.UserInfo.userId });

    if (!foundUser)
      return { statusCode: 401, message: "Unauthorised", authStatus: false };

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: foundUser[0]._id,
        },
      },
      ACCESS_TOKEN_SECRET ?? "",
      {
        expiresIn: "10s",
      }
    );

    return { statusCode: 201, accessToken, authStatus: true };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Internal server error",
      authStatus: false,
    };
  }
};

export const registerUser = async (
  email: string,
  password: string
): Promise<{
  statusCode: number;
  message: string;
  profile?: ProfileType | null;
}> => {
  try {
    const existingProfile = await Profile.find({ email: email });
    if (existingProfile.length != 0) {
      return { statusCode: 409, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfile = new Profile({
      email: email,
      password: hashedPassword,
    });

    const addedProfile = await newProfile.save();

    return {
      statusCode: 201,
      message: "Registration successful",
      profile: addedProfile,
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, message: "Internal server error" };
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{
  statusCode: number;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  authStatus: boolean;
}> => {
  try {
    const existingProfile = await Profile.find({ email: email });

    if (existingProfile.length === 0) {
      return {
        statusCode: 401,
        message: "Email doesn't exist, SignUp",
        authStatus: false,
      };
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingProfile[0].password
    );

    if (!passwordMatch) {
      return {
        statusCode: 401,
        message: "Invalid email or password",
        authStatus: false,
      };
    }

    const { _id } = existingProfile[0];
    const userId = _id.toString();

    const accessToken = jwt.sign(
      {
        UserInfo: {
          userId: userId,
        },
      },
      ACCESS_TOKEN_SECRET ?? "",
      {
        expiresIn: "10s",
      }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          userId: userId,
        },
      },
      REFRESH_TOKEN_SECRET ?? "",
      {
        expiresIn: "1d",
      }
    );

    return {
      statusCode: 201,
      message: "Login successful",
      accessToken,
      refreshToken,
      authStatus: true,
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Internal server error",
      authStatus: false,
    };
  }
};
