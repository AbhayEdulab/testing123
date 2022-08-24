
const { ObjectID } = require('mongodb');
const getMongoDBClient = require('../db/mongodbClient');

class BaseRepository {
  constructor(collectionName) {
    this.dbClient = getMongoDBClient();
    this.collection = collectionName;
  }

  getCount() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .countDocuments());
  }

  getCountFiltered(filter) {
    return this.dbClient
      .then(db => {
        return db.collection(this.collection).countDocuments({});
      });
  }

  findById(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .findOne({ _id: ObjectID(id) }));
  }

  add(item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertOne(item));
  }

  addMany(items) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .insertMany(items));
  }

  edit(id, item) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .updateOne({ _id: ObjectID(id) }, { $set: item }, { upsert: true }));
  }

  delete(id) {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .remove({ _id: ObjectID(id) }));
  }

  list() {
    return this.dbClient
      .then(db => db
        .collection(this.collection)
        .find());
  }

  listFiltered(filter) {
    return this.dbClient
        .then(db => {
          const data = db.collection(this.collection)
            .find(filter.query || {});

          if (filter.pageSize && filter.pageNumber) {
            data
              .skip(parseInt(filter.pageSize) * (parseInt(filter.pageNumber) - 1))
              .limit(parseInt(filter.pageSize));
          }

          if (filter.sortBy && filter.orderBy) {
            const sortSettings = { [filter.sortBy]: filter.orderBy === 'ASC' ? 1 : -1 };
            data.sort(sortSettings);
          }

          return data.toArray();
    });
  }
}

module.exports = BaseRepository;
