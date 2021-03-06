import messages from '../../../../../src/plugins/recordTypes/citation/messages';

chai.should();

describe('citation record messages', () => {
  it('should contain properties with id and defaultMessage properties', () => {
    messages.should.be.an('object');

    Object.keys(messages).forEach((citationName) => {
      const citationMessages = messages[citationName];

      Object.keys(citationMessages).forEach((name) => {
        citationMessages[name].should.contain.all.keys(['id', 'defaultMessage']);
      });
    });
  });
});
