import { rJS, RSVP, GadgetInstance } from "renderjs";

// assertType is copied from rsvp
/** Static assertion that `value` has type `T` */
// Disable tslint here b/c the generic is used to let us do a type coercion and
// validate that coercion works for the type value "passed into" the function.
// tslint:disable-next-line:no-unnecessary-generics
declare function assertType<T>(value: T): void;

function testGadgetClassMethods() {
    rJS(window)
        .ready(function() {
            assertType<GadgetInstance>(this);
        })
        .declareMethod("methodName", function methodName(args) {
            assertType<GadgetInstance>(this);
            return 1234;
        })
        .declareService("service", function service() {
            assertType<GadgetInstance>(this);
            return new RSVP.Queue();
        })
        .declareJob("jobName", function jobName(args) {
            assertType<GadgetInstance>(this);
            return new RSVP.Queue();
        })
        .onEvent("click", function(e) {
            assertType<GadgetInstance>(this);
            assertType<Event>(e);
            e.preventDefault();
            return new RSVP.Queue().push(function() {
                return null;
            });
        })
        .onLoop(function() {
            assertType<GadgetInstance>(this);
        }, 1000)
        .allowPublicAcquisition("acquireableMethod", function(args) {
            assertType<GadgetInstance>(this);
            return 1234;
        })
        .declareAcquiredMethod("localMethod", "parentMethod");
}

function testGadgetInstance(gadget: GadgetInstance) {
    gadget.changeState({ foo: "bar" }).then(function() {
        console.log("state modified");
    });
    gadget.setState({ foo: "bar" }).then(function() {
        console.log("state replaced");
    });
    // state can be accessed.
    gadget.state["foo"];
    gadget.state.foo;
}

function testGadgetDeclaration(gadget: GadgetInstance) {
    gadget.declareGadget("https://www.example.org/public.html", {
        sandbox: "public",
        scope: "my-public-gadget",
        element: document.createElement("div")
    });
    gadget.declareGadget("https://www.example.org/iframe.html", {
        sandbox: "iframe",
        scope: "my-iframed-gadget",
        element: document.createElement("div")
    });
    gadget.getDeclaredGadget("my-iframe-gadget").then(g => {
        assertType<GadgetInstance>(g);
    });
}
