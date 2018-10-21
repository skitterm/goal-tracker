import { SQLite } from 'expo';

export default class DatabaseWrapper {
  constructor(params) {
    this.database = SQLite.openDatabase(params.name);
    this.tables = {};
  }

  addTable(name, schema) {
    const schemaQuery = this.createSchemaQuery(schema);

    this.executeQuery(`create table if not exists ${name} (${schemaQuery});`);
    this.tables[name] = schema;
  }

  executeQuery(sqlStatement) {
    this.database.transaction(
      transaction => {
        transaction.executeSql(
          sqlStatement,
          [],
          this.onTransactionSuccess,
          this.onTransactionError
        );
      },
      this.onDBError,
      this.onDBSuccess
    );
  }

  onTransactionSuccess = (transaction, resultSet) => {
    debugger;
  };

  onTransactionError = (transaction, error) => {
    debugger;
  };

  onDBSuccess = (one, two, three) => {
    debugger;
  };

  onDBError = (one, two, three) => {
    debugger;
  };

  createSchemaQuery(schemaMap) {
    // iterate over the map. For each, build out its text string accordingly.
    const schemaStatements = [];

    schemaMap.forEach((value, key) => {
      const baseStatement = `${key} ${value.type}`;
      const extraStatements = [];

      if (value.nullable === false) {
        extraStatements.push('not null');
      }

      if (value.isPrimaryKey === true) {
        extraStatements.push('primary key');
      }

      if (value.autoIncrement === true) {
        extraStatements.push('autoincrement');
      }

      schemaStatements.push(
        `${baseStatement}${
          extraStatements.length > 0 ? ' ' + extraStatements.join(' ') : ''
        }`
      );
    });

    const query = schemaStatements.join(', ');
    return query;
  }
}

export const addRow = () => {
  executeQuery(`insert into Foods (name, age) values('cucumber', 28);`);
};

export const viewRow = () => {
  executeQuery(`select * from Foods where name = 'cucumber';`);
};

export const updateRow = () => {
  executeQuery(`update Foods set age = 55 where name = 'cucumber'`);
};

export const deleteRow = () => {
  executeQuery(`delete from Foods where name = 'cucumber'`);
};
