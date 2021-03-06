// @flow
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import * as validate from './validate.mjs';
/*::
import * as generated from './__generated__/api.graphql'
import type { Resolver } from './index'
*/

export const validateAuth = (input /*: generated.AuthInput */) => {
  // We have to return all props.
  const shape = { email: null, password: null };
  const email = validate.email(input.email);
  // We can't use object spread, because some Webpack bug.
  // TODO: Recheck it with Webpack 4.
  // if (email) return { ...shape, email };
  if (email) return Object.assign({}, shape, { email });
  const password = validate.max1024Min5Chars(input.password);
  if (password) return Object.assign({}, shape, { password });
};

const auth /*: Resolver<{ input: generated.AuthInput }> */ = async (
  parent,
  { input },
  context,
) => {
  const errors = validateAuth(input);
  if (errors) return { errors };

  const createAuthPayload = user => ({
    token: jsonwebtoken.sign({ userId: user.id }, process.env.API_SECRET || ''),
  });

  if (input.isSignUp) {
    const exists = await context.db.exists.User({ email: input.email });
    if (exists)
      return {
        errors: {
          email: 'ALREADY_EXISTS',
        },
      };
    const password = await bcrypt.hash(input.password, 10);
    const user = await context.db.mutation.createUser({
      data: { email: input.email, password },
    });
    return createAuthPayload(user);
  } else {
    const user = await context.db.query.user({ where: { email: input.email } });
    if (!user)
      return {
        errors: { email: 'NOT_EXISTS' },
      };
    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid)
      return {
        errors: { password: 'WRONG_PASSWORD' },
      };
    return createAuthPayload(user);
  }
};

const setTheme /*: Resolver<{ input: generated.SetThemeInput }> */ = async (
  parent,
  args,
  context,
) => {
  const userId = context.getUserId();
  const user = await context.db.mutation.updateUser({
    data: { themeName: args.input.themeName },
    where: { id: userId },
  });
  return { user };
};

const me /*: Resolver<{}> */ = async (parent, args, context) => {
  const userId = context.getUserId();
  const user = await context.db.query.user({ where: { id: userId } });
  return user;
};

export default {
  mutations: {
    auth,
    setTheme,
  },
  queries: {
    me,
  },
};
