'use strict';

/**
 * NorthstarClient.test
 */
require('dotenv').config();
const NorthstarClient = require('../lib/northstar-client');

/**
 * Test Northstar Nodejs client.
 */
describe('NorthstarClient', () => {
  /**
   * Helper: get default client.
   */
  function getUnauthorizedClient() {
    return new NorthstarClient({
      baseURI: process.env.DS_REST_API_BASEURI,
    });
  }
  /**
   * Helper: get default client.
   */
  function getAuthorizedClient() {
    return new NorthstarClient({
      baseURI: process.env.DS_REST_API_BASEURI,
      apiKey: process.env.DS_REST_API_KEY,
    });
  }

  // Without X-DS-REST-API-Key.
  describe('unauthorized', () => {
    /**
     * Helper: validate unauthorized user object.
     */
    function unauthorizedTestUser(user) {
      // TODO: check to be an instance of NorthstarUser.
      user.should.be.an.Object();

      // Ensure properties and test values.
      user.should.have.properties({
        id: '5480c950bffebc651c8b456f',
        first_name: 'test',
        last_initial: 'L',
        photo: 'https://avatar.dosomething.org/uploads/avatars/5480c950bffebc651c8b456f.jpeg',
        language: 'en-global',
        country: 'US',
        drupal_id: '187',
      });

      // Just ensure presence.
      user.should.have.properties(['updated_at', 'created_at']);
    }

    // Constructor.
    describe('constructor', () => {
      // Test new instance.
      it('without options should throw a TypeError', () => {
        (() => new NorthstarClient()).should.throw(TypeError);
      });

      // Check API base URL.
      it('base URL option should be set', () => {
        process.env.DS_REST_API_BASEURI.should.be.not.empty();
      });

      // Test new instance.
      it('should create new instance configured correctly', () => {
        const client = getUnauthorizedClient();
        client.should.be.an.instanceof(NorthstarClient);
        client.should.have.property('baseURI').which.is.not.empty();
        client.should.have.property('apiKey').which.is.empty();
      });
    });

    // Get single user.
    describe('getUser()', () => {
      // Check getUser method.
      it('getUser() should be exposed', () => {
        getUnauthorizedClient().getUser.should.be.a.Function();
      });

      // By id.
      it('by id should return correct Northstar user', () => {
        const client = getUnauthorizedClient();
        const response = client.getUser('id', '5480c950bffebc651c8b456f');

        // Check response to be a Promise.
        response.should.be.a.Promise();
        return response.should.eventually.match(unauthorizedTestUser);
      });
    });
  });

  // With X-DS-REST-API-Key.
  describe('authorized', () => {
    // Constructor.
    describe('constructor', () => {
      // Check API key
      it('Rest API key should be set', () => {
        process.env.DS_REST_API_KEY.should.be.not.empty();
      });

      // Test new instance.
      it('should create new instance configured correctly', () => {
        const client = getAuthorizedClient();
        client.should.be.an.instanceof(NorthstarClient);
        client.should.have.property('baseURI').which.is.not.empty();
        client.should.have.property('apiKey').which.is.not.empty();
      });
    });
  });
});