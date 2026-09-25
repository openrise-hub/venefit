migrate((db) => {
  const collection1 = Dao(db).findCollectionByNameOrId("routine_exercises");
  if (collection1) {
    collection1.schema.addField(new SchemaField({
      system: false,
      id: "re_set_type",
      name: "set_type",
      type: "text",
      required: false,
      options: { min: null, max: null, pattern: "" }
    }));
    collection1.schema.addField(new SchemaField({
      system: false,
      id: "re_superset_tag",
      name: "superset_tag",
      type: "text",
      required: false,
      options: { min: null, max: null, pattern: "" }
    }));
    Dao(db).saveCollection(collection1);
  }

  const collection2 = Dao(db).findCollectionByNameOrId("daily_set_results");
  if (collection2) {
    collection2.schema.addField(new SchemaField({
      system: false,
      id: "ds_set_type",
      name: "set_type",
      type: "text",
      required: false,
      options: { min: null, max: null, pattern: "" }
    }));
    Dao(db).saveCollection(collection2);
  }
}, (db) => {
  return null;
});
