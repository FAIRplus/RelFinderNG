import { FirstCaseUpperPipe } from './first-case-upper.pipe';

describe('FirstCaseUpperPipe', () => {
  let pipe : FirstCaseUpperPipe;

  beforeEach(() => {
      pipe = new FirstCaseUpperPipe();
  });

  afterEach(() => {
      pipe = null;
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('#should return the FirtCharacter capital', (done) => {
    let result = pipe.transform('connectvity');
    expect(result).toEqual('Connectvity');
    done();
   });
   it('#should return the FirtCharacter capital but matching with small char value', (done) => {
    let result = pipe.transform('connectvity');
    expect(result).not.toEqual('connectvity');
    done();
   });

});
