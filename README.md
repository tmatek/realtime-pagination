# Realtime pagination

This example demonstrates cursor-based pagination for a list of most
popular users (sorted by reputation). Reputation is **volatile**,
meaning it is changing rapidly. Because of this, order of items within a page may change, causing the same user to appear on multiple pages.

To support stable pagination it is necessary to take snapshots of data collections.
On the first page visit, server will generate a timestamp that will become part
of next/previous page cursors. Timestamp provides stability of pages during
create/update/delete operations. However, several changes are required on the data store
level to support this:

- **Create** operation: `created_at` date-time column ensures that all users
  created after the timestamp are not included in the result set. This ensures that page size is constant. A good solution is to set the default value of `created_at` column to the current timestamp, removing the need to do anything special in app code.

- **Delete** operation: in majority of cases this is a destructive operation as the user is permanently removed from the data store. As with create operation, the problem here is that page size will not be constant during page changes if users start disappearing. The solution is to make this operation non-destructive, by introducing a `deleted_at` date-time column. We are thus marking users as deleted but not actually removing them from the data store. The server can then keep users whose delete time is after the timestamp in the result sets. An added bonus is the support for undo-delete feature.

* **Update** operation: problematic because items within a single page may shift between page changes (due to reputation changes invalidating the sort order), or worse, may jump to next/previous page (a user appears on multiple pages). The solution is to introduce a simple version-control system for users in the data store. When updating a user, rather than executing an update query, we mark the user as deleted and then insert a new user with updated fields. This fits in nicely with the previous two operations, as the server will not show the updated (newly created) user and will keep the old user (marked as deleted) in the result sets. The only thing left to handle is the primary key, which could now be a tuple _(user id, version number)_.

During page navigation, server can check if the collection has become stale, as it has the timestamp of when the user first accessed the collection.

## Demo app

`npm i && npm start`

Open `http://localhost:3000/` to view the table of most popular users.

Random data generators are used to simulate realtime create, update and delete operations. Check the console output for more details.
