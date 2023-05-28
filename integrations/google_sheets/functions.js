const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = require('../../google_sheets_credentials.json');

const {
  sheet_ids,
} = require('./sheets_id');

const accessSpreadsheet = async (file_name, sheetIndex) => {
  const doc = new GoogleSpreadsheet(
    sheet_ids[file_name],
  );

  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[sheetIndex];
  // console.log(sheet.title);

  return sheet;
};

const sheetRows = async (sheet) => {
  const rows = await sheet.getRows();
  return rows;
};

const sheetHeaders = async (sheet) => {
  const headers = await sheet.headerValues;
  return headers;
};

module.exports = {
  accessSpreadsheet,
  sheetRows,
  sheetHeaders,
};
