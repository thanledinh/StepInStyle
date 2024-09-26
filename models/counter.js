const connectDb = require('./db');

async function getNextSequenceValue(sequenceName) {
  const db = await connectDb();
  const countersCollection = db.collection('counters');
  const sequenceDocument = await countersCollection.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { returnOriginal: false, upsert: true }
  );
  return sequenceDocument.value.sequence_value;
}

module.exports = getNextSequenceValue;