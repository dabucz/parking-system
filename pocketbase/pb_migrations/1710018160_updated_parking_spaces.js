/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lxz25gkamf2ur70")

  // remove
  collection.schema.removeField("z8ocpquj")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lxz25gkamf2ur70")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "z8ocpquj",
    "name": "occupations",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "axlm2lh92wxxhi0",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
