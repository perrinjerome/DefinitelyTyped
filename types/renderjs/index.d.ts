// Type definitions for renderjs 0.20.0
// Project: https://lab.nexedi.com/nexedi/renderjs
// Definitions by: Jérome Perrin <https://github.com/perrinjerome>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.4

/**
 * XXX the patched version of RSVP that renderjs uses.
 */
declare namespace RSVP {
    class Queue<R> extends Promise<any> {
        constructor();
        push<U>(
            onFulfilled?: (value: R) => U | Promise<U>,
            onRejected?: (error: any) => void
        ): Queue<R>;
    }
}

/**
 * A gadget state dict.
 */
declare interface GadgetState {
    [key: string]: any;
}

/**
 * Options to declare a gadget.
 */
interface GadgetDeclarationOptions {
    /**
     * The local name of the gadget in declarer namespace
     */
    scope: string;

    /**
     * The sandbox type, can be iframe to render in an iframe or public to render in the
     * same window context.
     */
    sandbox: "public" | "iframe";

    /**
     * The element where to bind the gadget.
     */
    element: HTMLElement;
}

/**
 * RenderJS gadget instance
 */
export class GadgetInstance {
    /**
     * The current state of the gadget.
     * To mutate the state, use `changeState`.
     */
    public state: GadgetState;

    /**
     * `getDeclaredGadget`: Get a Previously Declared Child Gadget
     *
     * The parameters exactly correspond to those when declaring the gadget in HTML, with the addition of element, to specify an element to wrap the gadget in, rather than the default auto-generated <div>.
     *
     * @params `gadgetURL` the URL of the HTML page of the gadget.
     * @params `options` the gadget options
     */
    declareGadget(
        gadgetURL: string,
        options: GadgetDeclarationOptions
    ): RSVP.Queue<GadgetInstance>;

    /**
     * `getDeclaredGadget`: Get a Previously Declared Child Gadget
     *
     * Returns a child gadget instance, previously declared with `declareGadget`.
     *
     * @params `gadgetScope`: the scope of the previously declared gadget.
     */
    getDeclaredGadget(gadgetScope: string): RSVP.Queue<GadgetInstance>;

    /**
     * `setState`: Set Initial State
     *
     * The gadget's state should be set once when initialising the gadget. The state should contain key/value pairs, but the state is just an ordinary JavaScript object with no hard restrictions.
     *
     * @params `initialState`: the initial state.
     */
    setState(initialState: GadgetState): Promise<void>;

    /**
     * `changeState`: Change State
     *
     * Change the state by passing in a new key-value pair, which only overwrites the keys provided in the changeState call, and only if the current and new values are different. All other keys remain unchanged.
     *
     * @params `newState`: the changes made to the state.
     */
    changeState(newState: GadgetState): Promise<void>;
}

/**
 *  RenderJs gadget class.
 */
interface Gadget {
    /**
     * `onStateChange`: Change State Callback.
     *
     * @params handler function implementing the service logic.
     */
    onStateChange(
        handler: (
            this: GadgetInstance,
            modification_dict: GadgetState
        ) => RSVP.Queue<{}>
    ): Gadget;

    /**
     * `ready`: define a function to be called when gadget is ready
     *
     * The ready handler is triggered automatically when all gadget dependencies have loaded.
     *
     * @params f function to call when gadget is ready.
     */
    ready(f: (this: GadgetInstance) => RSVP.Queue<{}> | void): Gadget;

    /**
     * `declareMethod`: Declare Method
     *
     * The ready handler is triggered automatically when all gadget dependencies have loaded.
     *
     * @params `methodName` name of the method
     * @params `method` function implementing the method logic.
     */
    declareMethod(
        methodName: string,
        method: (this: GadgetInstance, ...args: any[]) => any
    ): Gadget;

    /**
     * `declareService`: Declare a service.
     *
     * Services automatically trigger as soon as the gadget is loaded into the DOM, and are usually used for event binding. There can be multiple declareService handlers, which all trigger simultaneously.
     *
     * @params `serviceName` name of the service
     * @params `service` function implementing the service logic.
     */
    declareService(
        serviceName: string,
        service: (this: GadgetInstance) => RSVP.Queue<{}>
    ): Gadget;

    /**
     * `declareJob`: Declare a job.
     *
     * Jobs manually trigger by being called, like an ordinary RenderJS method. However, calling a job cancels the last call of the job if it hasn't finished.   *
     *
     * @params `jobName` name of the job
     * @params `service` function implementing the job logic.
     */
    declareJob(
        jobName: string,
        job: (this: GadgetInstance, ...args: any[]) => RSVP.Queue<{}>
    ): Gadget;

    /**
     * `onEvent`: Bind Event.
     *
     * Jobs manually trigger by being called, like an ordinary RenderJS method. However, calling a job cancels the last call of the job if it hasn't finished.   *
     *
     * @params `eventName` name of the Event
     * @params `eventHandler` function implementing the logic.
     */
    onEvent(
        eventName: string,
        eventHandler: (
            this: GadgetInstance,
            event: Event
        ) => RSVP.Queue<{}> | void
    ): Gadget;

    /**
     * `onLoop`: Loop.
     *
     * When the gadget is displayed, loop on the callback method in a service.
     * A delay can be configured between each loop execution.
     *
     * @params `loopFunction` the function to execute in the loop.
     * @params `delay` the delay between call, in seconds.
     */
    onLoop(loopFunction: (this: GadgetInstance) => void, delay: number): Gadget;

    /**
     * `allowPublicAcquisition`: Publish Method.
     *
     * Publish a method to allow children to acquire it.
     * Only methods passed into allowPublicAcquisition in a parent gadget can be acquired using declareAcquiredMethod in a child gadget.
     *
     * @params `methodName` name of the method
     * @params `method` function implementing the method logic.
     */
    allowPublicAcquisition(
        methodName: string,
        method: (this: GadgetInstance, ...args: any[]) => any
    ): Gadget;

    /**
     * `allowPublicAcquisition`: Publish Method.
     *
     * Acquire a method from a parent gadget, by passing the name of the published method as the first parameter and the name to call it locally as the second parameter.
     *
     * @params `localMethodName` name of the method as seen from this gadget instance.
     * @params `parentMethodName` name of the method on the parent gadget instance.
     */
    declareAcquiredMethod(
        localMethodName: string,
        parentMethodName: string
    ): Gadget;
}

/**
 * Initialize this gadget.
 */
declare function rJS(window: Window): Gadget;
