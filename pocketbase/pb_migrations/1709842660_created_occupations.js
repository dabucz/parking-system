/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "axlm2lh92wxxhi0",
    "created": "2024-03-07 20:17:40.406Z",
    "updated": "2024-03-07 20:17:40.406Z",
    "name": "occupations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hkfgdiie",
        "name": "dateOccupied",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "un5izdxz",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
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
  const collection = dao.findCollectionByNameOrId("axlm2lh92wxxhi0");

  return dao.deleteCollection(collection);
})
