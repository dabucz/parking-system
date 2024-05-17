/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "lxz25gkamf2ur70",
    "created": "2024-03-07 20:18:02.815Z",
    "updated": "2024-03-07 20:18:02.815Z",
    "name": "parking_spaces",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vlwjv1x5",
        "name": "number",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lxz25gkamf2ur70");

  return dao.deleteCollection(collection);
})
