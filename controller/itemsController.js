const dotenv = require("dotenv");
dotenv.config();
const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

exports.getGroupMembers = async (req, res) => {
  const params = {
    TableName: process.env.aws_group_members_table_name,
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

// TODO #1.1: Get items from DynamoDB
exports.getItems = async (req, res) => {

  try {
    // console.log(await docClient.send(new ScanCommand(scanParams)))
    const data = await docClient.send(new ScanCommand({
      TableName: process.env.aws_items_table_name,
    }));
    console.log(data.Items)
    res.send(data.Items);
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};


// TODO #1.2: Add an item to DynamoDB
exports.addItem = async (req, res) => {
  console.log(req.body)
  const item_id = uuidv4();
  const created_date = Date.now();
  const item = { item_id: item_id, ...req.body, created_date: created_date };
  const putParams = {
    Item: item,
    TableName: process.env.aws_items_table_name,
  };
  try {
    const response = await docClient.send(new PutCommand(putParams));
    console.log(response);
    res.send("Added");
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};


// TODO #1.3: Delete an item from DynamDB
exports.deleteItem = async (req, res) => {
  const item_id = req.params.item_id;
  const deleteParams = {
    TableName: process.env.aws_items_table_name,
    Key: {
      item_id: item_id,
    },
  };
  try {
    const response = await docClient.send(new DeleteCommand(deleteParams));
    console.log(response);
    res.send("Delete item successfully");
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
  }
};

