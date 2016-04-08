// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest-as-promised';
import Koa from 'koa';
import convert from 'koa-convert';
import mount from 'koa-mount';
import graphqlHTTP from '..';


describe('Useful errors when incorrectly used', () => {

  it('requires an option factory function', () => {
    expect(() => {
      graphqlHTTP();
    }).to.throw(
      'GraphQL middleware requires options.'
    );
  });

  it('requires option factory function to return object', async () => {
    var app = new Koa();

    app.use(mount('/graphql', convert(graphqlHTTP(() => null))));

    var caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }
    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message:
          'GraphQL middleware option function must return an options object.' }
      ]
    });
  });

  it('requires option factory function to return object with schema', async () => {
    var app = new Koa();

    app.use(mount('/graphql', convert(graphqlHTTP(() => ({})))));

    var caughtError;
    try {
      await request(app.listen()).get('/graphql?query={test}');
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError.response.status).to.equal(500);
    expect(JSON.parse(caughtError.response.text)).to.deep.equal({
      errors: [
        { message: 'GraphQL middleware options must contain a schema.' }
      ]
    });
  });

});
