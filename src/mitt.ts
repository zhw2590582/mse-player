// https://github.com/developit/mitt

type EventHandler = (event?: any) => void;
type WildCardEventHandler = (type: string, event?: any) => void;
type EventHandlerList = Array<EventHandler>;
type WildCardEventHandlerList = Array<WildCardEventHandler>;
type EventHandlerMap = {
    '*'?: WildCardEventHandlerList;
    [type: string]: EventHandlerList;
};

export default function mitt(all?: EventHandlerMap) {
    all = all || Object.create(null);

    return {
        on(type: string, handler: EventHandler) {
            (all[type] || (all[type] = [])).push(handler);
        },

        off(type: string, handler: EventHandler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },

        emit(type: string, evt: any) {
            (all[type] || []).slice().map(handler => {
                handler(evt);
            });
            (all['*'] || []).slice().map(handler => {
                handler(type, evt);
            });
        }
    };
}
