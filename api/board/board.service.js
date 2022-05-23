const dbService = require("../../services/db.service");
const logger = require("../../services/logger.service");
const ObjectId = require("mongodb").ObjectId;

async function query(filterBy) {
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection("board");
    var boards = await collection.find(criteria).toArray();
    return boards;
  } catch (err) {
    logger.error("cannot find boards", err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  if (!filterBy) return {};
  let criteria = {};
  if (filterBy.title) {
    const titleCriteria = { $regex: filterBy.title, $options: "i" };
    criteria.title = titleCriteria;
  }
  if (filterBy.inStock) {
    criteria.inStock = true;
  }
  return criteria;
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    let board = await collection.findOne({ _id: ObjectId(boardId) });
    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection("board");
    await collection.deleteOne({ _id: ObjectId(boardId) });
    return boardId;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(board) {
  try {
    board.createdAt = Date.now();
    const collection = await dbService.getCollection("board");
    await collection.insertOne(board);
    return board;
  } catch (err) {
    logger.error("cannot insert board", err);
    throw err;
  }
}

async function update(board) {
  try {
    var id = ObjectId(board._id);
    delete board._id;
    const collection = await dbService.getCollection("board");
    await collection.updateOne({ _id: id }, { $set: { ...board } });
    return board;
  } catch (err) {
    logger.error(`cannot update board ${boardId}`, err);
    throw err;
  }
}

module.exports = {
  remove,
  query,
  getById,
  add,
  update,
};
