import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { UserService } from "src/user/user.service";
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google')
{
    constructor(private userService: UserService)
    {
        super({
            clientID: `${process.env.GOOGLE_CLIENT_ID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
            callbackURL: `${process.env.GOOGLE_CALLBACK_URL}`,
            scope:["email","profile"],
        })
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { emails, name, photos } = profile;
        const email = emails[0].value;
        console.log(profile);

        let user = await this.userService.findOneByEmail(email);
        if (!user) {
          user = await this.userService.create({
            email,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
          });
        }
    
        done(null, user); // Pass the user to the request
      }

}