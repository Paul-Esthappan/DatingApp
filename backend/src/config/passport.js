const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');
const crypto = require('crypto');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL || "http://localhost:3001/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new TypeError('Access token is not a valid string');
    }

    if (refreshToken && typeof refreshToken !== 'string') {
      throw new TypeError('Refresh token is not a valid string');
    }

    let user = await User.findOne({ googleId: profile.id }).exec();

    const encryptedAccessTokenData = encryptToken(accessToken);
    const encryptedRefreshTokenData = refreshToken ? encryptToken(refreshToken) : null;

    if (!user) {
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
        accessToken: encryptedAccessTokenData.encrypted,
        refreshToken: encryptedRefreshTokenData ? encryptedRefreshTokenData.encrypted : '',
        accessIV: encryptedAccessTokenData.iv,
        refreshIV: encryptedRefreshTokenData ? encryptedRefreshTokenData.iv : ''
      });
      await user.save();
    } else {
      user.accessToken = encryptedAccessTokenData.encrypted;
      user.refreshToken = encryptedRefreshTokenData ? encryptedRefreshTokenData.encrypted : '';
      user.accessIV = encryptedAccessTokenData.iv;
      user.refreshIV = encryptedRefreshTokenData ? encryptedRefreshTokenData.iv : '';
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    console.error('Error in GoogleStrategy callback:', err);
    return done(err, null);
  }
}));

function encryptToken(token) {
  if (!token || typeof token !== 'string') {
    throw new TypeError('Token must be a non-empty string');
  }

  const algorithm = 'aes-256-cbc';
  const encryptionKey = process.env.ENCRYPTION_KEY;

  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY is not defined in environment variables.');
  }

  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return { encrypted, iv: iv.toString('hex') };
}
