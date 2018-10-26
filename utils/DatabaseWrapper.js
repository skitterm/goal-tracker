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

  addRow = (table, dataMap) => {
    const fields = [];
    const values = [];

    dataMap.forEach((value, key) => {
      fields.push(key);
      values.push(typeof value === 'string' ? `"${value}"` : value.toString());
    });

    const fieldsString = `(${fields.join(', ')})`;
    const valuesString = `values(${values.join(', ')})`;
    return this.executeQuery(
      `insert into ${table} ${fieldsString} ${valuesString};`
    ).then(resultSet => {
      return resultSet.insertId;
    });
    // return this.executeQuery(`delete from Goals where title = "Brush teeth"`);
  };

  viewRow = () => {
    // this.executeQuery(`select * from Foods where name = 'cucumber';`);
  };

  updateRow = () => {
    // this.executeQuery(`update Foods set age = 55 where name = 'cucumber'`);
  };

  deleteRow = () => {
    // this.executeQuery(`delete from Foods where name = 'cucumber'`);
  };

  executeQuery(sqlStatement) {
    return new Promise((resolve, reject) => {
      this.database.transaction(
        transaction => {
          transaction.executeSql(
            sqlStatement,
            [],
            (transaction, resultSet) => {
              resolve(resultSet);
            },
            (transaction, error) => {
              reject(error);
            }
          );
        },
        error => {
          reject(error);
        },
        null
      );
    });
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
