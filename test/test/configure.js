const chai = require('chai');
const woven = require('../../index');
const functions = require('../util/functions');
const options = require('../../src/options');

const should = chai.should();

describe('Configure function tests', () => {
  
  before(() => {
    woven.configure(functions, {
      alwaysClient: false,
      alwaysServer: true,
      dynamicMax: 10000,
      fallback: 'client',
      maxThreads: 40,
      pingSize: 'medium',
    });
  });

  after(() => {
    woven.configure(functions, {
      alwaysClient: false,
      alwaysServer: false,
      dynamicMax: 500,
      fallback: 'server',
      maxThreads: 12,
      pingSize: 100,
    });
  });

  describe('Should be able to pass in arguments', () => {
    it('passes in functions object', () => {
      options.should.have.property('functions');
      options.functions.should.have.property('processSepia');
      options.functions.should.have.property('addTen');
    });

    it('correctly configures options object', () => {
      options.alwaysClient.should.equal(false);
      options.alwaysServer.should.equal(true);
      options.dynamicMax.should.equal(10000);
      options.fallback.should.equal('client');
      options.maxThreads.should.equal(40);
      options.pingSize.should.equal(50000); // medium setting for pingSize
    });
  });
  

  describe('Should correctly configure ping', () => {
    
    before(() => woven.configure(functions, { pingSize: 10000 }));
    it('creates ping of correct length with numerical values', () => {
      options.stringPing.length.should.equal(10000/2); // each letter is 2 bytes
    });
    
    describe('creates ping of correct length with text values:', () => {
      
      describe('tiny', () => {
        before(() => woven.configure(functions, { pingSize: 'tiny' }));
        it('length === 50', () => options.stringPing.length.should.equal(100/2));
      });

      describe('small', () => {
        before(() => woven.configure(functions, { pingSize: 'small' }));
        it('length === 2000', () => options.stringPing.length.should.equal(4000/2));
      });

      describe('medium', () => {
        before(() => woven.configure(functions, { pingSize: 'medium' }));
        it('length === 25000', () => options.stringPing.length.should.equal(50000/2));
      });

      describe('large', () => {
        before(() => woven.configure(functions, { pingSize: 'large' }));
        it('length === 200000', () => options.stringPing.length.should.equal(400000/2));
      });

      describe('huge', () => {
        before(() => woven.configure(functions, { pingSize: 'huge' }));
        it('length === 500000', () => options.stringPing.length.should.equal(1000000/2));
      });
    });
    
    it('throws error if ping size is too large', () => {
      (() => woven.configure(functions, { pingSize: 20000000 })).should.throw();
    });
  });

  describe('Should throw error if incorrect data types are passed in', () => {

    it('alwaysClient', () => {
      (() => woven.configure(functions, { alwaysClient: 4 })).should.throw();
    });

    it('alwaysServer', () => {
      (() => woven.configure(functions, { alwaysServer: 'eggs' })).should.throw();
    });

    it('dynamicMax', () => {
      (() => woven.configure(functions, { dynamicMax: 'poop' })).should.throw();
    });

    it('fallback', () => {
      (() => woven.configure(functions, { fallback: 'hnnnngghhh' })).should.throw();
    });

    it('maxThreads', () => {
      (() => woven.configure(functions, { maxThreads: 'twenty' })).should.throw();
    });

    it('pingSize', () => {
      (() => woven.configure(functions, { pingSize: { ping: 'ping' } })).should.throw();
    });

    it('incorrect fields', () => {
      (() => woven.configure(functions, { functions })).should.throw();
      (() => woven.configure(functions, { stringPing: 'abcdefg' })).should.throw();
    })

    it('fail to include functions', () => {
      (() => woven.configure()).should.throw();
    });
  });
});

// restore defaults
