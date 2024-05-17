/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("axlm2lh92wxxhi0")

  collection.deleteRule = "@request.auth.id = user.occupations_via_user.user"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("axlm2lh92wxxhi0")

  collection.deleteRule = null

  return dao.saveCollection(collection)
})
