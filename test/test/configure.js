require('chai'); // using should
const path = require('path');
const os = require('os');
const woven = require('../../index');
const options = require('../../src/options');

const functionsPath = path.resolve(__dirname, '../util/functions.js');

describe('Configure function tests', () => {
  describe('Should be able to pass in arguments', () => {
    before(() => {
      woven.configure(functionsPath, {
        alwaysClient: false,
        alwaysServer: true,
        dynamicMax: 10000,
        fallback: 'client',
        maxChildThreads: 12,
        maxWorkerThreads: 40,
        pingSize: 'medium',
        useChildProcess: false,
        useWebWorkers: false,
        writeFileSync: true,
      });
    });

    after(() => {
      woven.configure(functionsPath, {
        alwaysClient: false,
        alwaysServer: false,
        dynamicMax: 500,
        fallback: 'server',
        maxChildThreads: os.cpus().length,
        maxWorkerThreads: 12,
        pingSize: 100,
        useChildProcess: true,
        useWebWorkers: true,
        writeFileSync: false,
      });
    });

    it('passes in functionsPath string', () => {
      options.should.have.property('execSyncFilePath', functionsPath.slice(0, -3).concat('_woven_exec_sync.js'));
    });

    it('correctly configures options object', () => {
      options.alwaysClient.should.equal(false);
      options.alwaysServer.should.equal(true);
      options.dynamicMax.should.equal(10000);
      options.fallback.should.equal('client');
      options.maxChildThreads.should.equal(12);
      options.maxWorkerThreads.should.equal(40);
      options.pingSize.should.equal(50000); // medium setting for pingSize
      options.useChildProcess.should.equal(false);
      options.useWebWorkers.should.equal(false);
    });
  });

  describe('Should correctly configure ping', () => {
    before(() => woven.configure(functionsPath, { pingSize: 10000 }));
    it('creates ping of correct length with numerical values', () => {
      options.stringPing.length.should.equal(10000 / 2); // each letter is 2 bytes
    });

    describe('creates ping of correct length with text values:', () => {
      describe('tiny', () => {
        before(() => woven.configure(functionsPath, { pingSize: 'tiny' }));
        it('length === 50', () => options.stringPing.length.should.equal(100 / 2));
      });

      describe('small', () => {
        before(() => woven.configure(functionsPath, { pingSize: 'small' }));
        it('length === 2000', () => options.stringPing.length.should.equal(4000 / 2));
      });

      describe('medium', () => {
        before(() => woven.configure(functionsPath, { pingSize: 'medium' }));
        it('length === 25000', () => options.stringPing.length.should.equal(50000 / 2));
      });

      describe('large', () => {
        before(() => woven.configure(functionsPath, { pingSize: 'large' }));
        it('length === 200000', () => options.stringPing.length.should.equal(400000 / 2));
      });

      describe('huge', () => {
        before(() => woven.configure(functionsPath, { pingSize: 'huge' }));
        after(() => woven.configure(functionsPath, { pingSize: 100 }));
        it('length === 500000', () => options.stringPing.length.should.equal(1000000 / 2));
      });
    });

    it('throws error if ping size is too large', () => {
      (() => woven.configure(functionsPath, { pingSize: 20000000 })).should.throw();
    });
  });

  describe('Should throw error if incorrect data types are passed in', () => {
    it('alwaysClient', () => {
      (() => woven.configure(functionsPath, { alwaysClient: 4 })).should.throw();
    });

    it('alwaysServer', () => {
      (() => woven.configure(functionsPath, { alwaysServer: 'eggs' })).should.throw();
    });

    it('dynamicMax', () => {
      (() => woven.configure(functionsPath, { dynamicMax: 'poop' })).should.throw();
    });

    it('fallback', () => {
      (() => woven.configure(functionsPath, { fallback: 'hnnnngghhh' })).should.throw();
    });

    it('maxThreads', () => {
      (() => woven.configure(functionsPath, { maxThreads: 'twenty' })).should.throw();
    });

    it('pingSize', () => {
      (() => woven.configure(functionsPath, { pingSize: { ping: 'ping' } })).should.throw();
    });

    it('incorrect fields', () => {
      (() => woven.configure(functionsPath, { functionsPath })).should.throw();
      (() => woven.configure(functionsPath, { stringPing: 'abcdefg' })).should.throw();
    });

    it('fail to include functions', () => {
      (() => woven.configure()).should.throw();
    });
  });
});
