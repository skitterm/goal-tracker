const schema = new Map([
  [
    "id",
    {
      type: "integer",
      nullable: false,
      isPrimaryKey: true,
      autoIncrement: true
    }
  ],
  [
    "title",
    { type: "text", nullable: true, isPrimaryKey: false, autoIncrement: false }
  ],
  [
    "description",
    { type: "text", nullable: true, isPrimaryKey: false, autoIncrement: false }
  ],
  [
    "frequency",
    { type: "text", nullable: false, isPrimaryKey: false, autoIncrement: false }
  ],
  [
    "deadline",
    {
      type: "integer",
      nullable: false,
      isPrimaryKey: false,
      autoIncrement: false
    }
  ],
  [
    "inProgress",
    {
      type: "integer",
      nullable: true,
      isPrimaryKey: false,
      autoIncrement: false
    }
  ],
  [
    "completed",
    {
      type: "integer",
      nullable: true,
      isPrimaryKey: false,
      autoIncrement: false
    }
  ],
  [
    "timesAchieved",
    {
      type: "integer",
      nullable: true,
      isPrimaryKey: false,
      autoIncrement: false
    }
  ],
  [
    "timesMissed",
    {
      type: "integer",
      nullable: true,
      isPrimaryKey: false,
      autoIncrement: false
    }
  ]
]);

export default schema;
