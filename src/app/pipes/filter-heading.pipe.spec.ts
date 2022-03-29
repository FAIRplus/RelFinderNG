import { FilterHeading } from "./filter-heading.pipe";

describe('FilterHeading', () => {
    let pipe : FilterHeading;

    beforeEach(() => {
        pipe = new FilterHeading();
    });

    afterEach(() => {
        pipe = null;
    });

    it('should return the heading for class filter', (done) => {
        let result = pipe.transform('class');
        expect(result).toEqual('Object class');
        done();
    });

    it('should return the heading for link filter', (done) => {
        let result = pipe.transform('link');
        expect(result).toEqual('Link type');
        done();
    });

    it('should return the heading for length filter', (done) => {
        let result = pipe.transform('length');
        expect(result).toEqual('No of objects');
        done();
    });

    it('should return the heading for connectivity filter', (done) => {
        let result = pipe.transform('connectivity');
        expect(result).toEqual('Connectivity level');
        done();
    });

});