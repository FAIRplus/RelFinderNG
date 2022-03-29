import { TruncateStringPipe } from './truncate-string.pipe';

describe('TruncateStringPipe', () => {
  let pipe : TruncateStringPipe;

  beforeEach(() => {
      pipe = new TruncateStringPipe();
  });

  afterEach(() => {
      pipe = null;
  });

  it('#create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('#should return the truncated string for middle', (done) => {
      let result = pipe.transform('connectvity',10,'middle');
      expect(result).toEqual('C...ity');
      done();
  });
  
   it('#should return the truncated string for start', (done) => {
      let result = pipe.transform('connectvity',10,'start');
      expect(result).toEqual('...ectvity');
      done();
   });

   it('#should return the truncated string for end', (done) => {
    let result = pipe.transform('connectvity',10,'end');
    expect(result).toEqual('C...');
    done();
   });

   it('#should return the truncated string for end-space', (done) => {
    let result = pipe.transform('connectvity',10,'end-space');
    expect(result).toEqual('C  ...');
    done();
   });
   
   it('#should return the truncated string for middle', (done) => {
    let result = pipe.transform('connectvity',10);
    expect(result).toEqual('C...ity');
    done();
   });

   it('#should return original string ', (done) => {
    let result = pipe.transform('length',10);
    expect(result).toEqual('length');
    done();
   });

});
