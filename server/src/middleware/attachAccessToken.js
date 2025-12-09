import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import generateTokens from '../utils/generateJWT.js';

const attachAccessToken = async(req, res, next) => {

}

export default attachAccessToken;