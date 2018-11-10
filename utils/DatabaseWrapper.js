import { SQLite } from 'expo';
// wrapper for the Expo SQLite module (https://docs.expo.io/versions/latest/sdk/sqlite)

export default class DatabaseWrapper {
  constructor(params) {
    // make sure the database is open before using
    this.database = SQLite.openDatabase(params.name);
    this.tables = {};
  }

  // adds the table to the database
  addTable(name, schema) {
    const schemaQuery = this.createSchemaQuery(schema);

    this.executeQuery(`create table if not exists ${name} (${schemaQuery});`);
    this.tables[name] = schema;
  }

  // create new database row
  addRow = (table, dataMap) => {
    const fields = [];
    const values = [];

    // for each field in the row, add it to the values array.
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
  };

  // fetch a selection of rows
  readRows = (table, condition) => {
    return this.executeQuery(
      `select * from ${table} where ${condition.field} = "${condition.value}"`
    ).then(resultSet => {
      return resultSet.rows._array;
    });
  };

  // fetch all rows in a table
  readAllRows = table => {
    return this.executeQuery(`select * from ${table}`).then(resultSet => {
      return resultSet.rows._array;
    });
  };

  // edit a row
  updateRow = (table, fieldsToUpdate, condition) => {
    let setClause = '';

    for (let i = 0; i < fieldsToUpdate.length; i++) {
      const field = fieldsToUpdate[i];
      const fieldValue =
        typeof field.value === 'string' ? `"${field.value}"` : field.value;
      if (i > 0) {
        setClause += ', ';
      }
      setClause += `${field.name} = ${fieldValue}`;
    }

    return this.executeQuery(
      `update ${table} set ${setClause} where ${condition.field} = "${
        condition.value
      }"`
    ).then(resultSet => {
      return resultSet.rowsAffected;
    });
  };

  // remove a row
  deleteRow = (table, condition) => {
    return this.executeQuery(
      `delete from ${table} where ${condition.field} = "${condition.value}"`
    ).then(resultSet => {
      return resultSet.rowsAffected;
    });
  };

  // generic utility for executing a database transaction.
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

  // used to seed a generic database table
  createSchemaQuery(schemaMap) {
    // iterate over the map. For each, build out its text string accordingly.
    const schemaStatements = [];

    schemaMap.forEach((value, key) => {
      // base statements are just the name and the type of data
      const baseStatement = `${key} ${value.type}`;
      // extra statements could include not null, primary key, or autoincrement
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
