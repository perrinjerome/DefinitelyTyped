import { jIO, Query } from "jio";

// assertType is copied from rsvp
/** Static assertion that `value` has type `T` */
// Disable tslint here b/c the generic is used to let us do a type coercion and
// validate that coercion works for the type value "passed into" the function.
// tslint:disable-next-line:no-unnecessary-generics
declare function assertType<T>(value: T): void;

function testExample() {
    // the example from https://jio.nexedi.com/

    var my_image = "Image data";
    var my_video = "Video data";

    // create a new jIO storage
    var jio_instance = jIO.createJIO({ type: "local" });

    // post the metadata for "myVideo"
    return (
        jio_instance
            .put("document", {
                title: "My Video",
                type: "MovingImage",
                format: "video/ogg",
                description: "Images Compilation"
            })
            // post a thumbnail attachment
            .push(function() {
                return jio_instance.putAttachment(
                    "document",
                    "thumbnail",
                    new Blob([my_image], { type: "image/jpeg" })
                );
            })
            // post video attachment
            .push(function() {
                return jio_instance.putAttachment(
                    "document",
                    "video",
                    new Blob([my_video], { type: "video/ogg" })
                );
            })
            // catch any errors and throw
            .push(undefined, function(error) {
                console.log(error);
                throw error;
            })
    );
}

function test_allDocs() {
    var storage = jIO.createJIO({ type: "local" });
    storage
        .allDocs({
            query: {
                key: "id",
                value: "test",
                type: "simple"
            },
            limit: [1, 10]
        })
        .push(function(result) {
            console.log("there was", result.total_rows, "results");
            result.rows.map(r => {
                console.log(r.id, "=>", r.value);
            });
        });
}

function test_getAttachment() {
    var storage = jIO.createJIO({ type: "local" });
    storage.getAttachment("/", "text", { type: "text" }).push(t => {
        assertType<string>(t);
    });
    storage.getAttachment("/", "text", { type: "json" }).push(o => {
        assertType<object>(o);
    });
    storage.getAttachment("/", "text", { type: "blob" }).push(b => {
        assertType<Blob>(b);
    });
    storage.getAttachment("/", "text", { type: "data_url" }).push(t => {
        assertType<string>(t);
    });
    storage.getAttachment("/", "text", { type: "array_buffer" }).push(ab => {
        assertType<ArrayBuffer>(ab);
    });
}

function test_memorystorage() {
    var storage = jIO.createJIO({ type: "memory" });
}

function test_erp5storage() {
    var storage = jIO.createJIO({
        type: "erp5",
        url: "https://erp5.example.org",
        default_view_reference: "jio"
    });
}

function test_Query() {
    var str = Query.objectToSearchText({
        type: "complex",
        operator: "OR",
        query_list: [
            {
                key: "local_roles",
                type: "simple",
                value: "Assignee"
            },
            {
                key: "validation_state",
                type: "simple",
                value: "validated"
            }
        ]
    });
    assertType<string>(str);
}
