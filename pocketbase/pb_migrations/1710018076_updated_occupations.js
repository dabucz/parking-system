/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("axlm2lh92wxxhi0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bz4kzlq6",
    "name": "parkingSpace",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "lxz25gkamf2ur70",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("axlm2lh92wxxhi0")

  // remove
  collection.schema.removeField("bz4kzlq6")

  return dao.saveCollection(collection)
})
