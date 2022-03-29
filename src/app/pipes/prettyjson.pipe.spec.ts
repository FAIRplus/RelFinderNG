import { PrettyjsonPipe } from './prettyjson.pipe';

describe('PrettyjsonPipe', () => {
  let pipe: PrettyjsonPipe;

  beforeEach(() => {
    pipe = new PrettyjsonPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should not throw exception for empty content', () => {
    expect(pipe.transform('')).toEqual('');
  });

});
