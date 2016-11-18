const Events = function(){
  const events = this;

  events.before_listeners = {};
  events.listeners = {};
  events.after_listeners = {};

  events.emit = function(eventName){
    const context = this;
    const args = [].prototype.slice(arguments, 1);
    const listeners = [
      events.before_listeners[eventName],
      events.listeners[eventName],
      events.after_listeners[eventName]
    ];
    const hits = 0;

    for(var i=0; i < listeners.length; i++){
      const batch = listeners[i];
      if(Array.isArray(batch)){
        batch.forEach(function(listener){
          if(typeof listener == "function"){
            listener.apply(context, args);
            hits++;
          }
        });
      }
    }
    return hits;
  }

  // Generate before, on and after methods:

  const listener_methods = {
    before: events.before_listeners,
    on: events.listeners,
    after: events.after_listeners
  };

  for(var method in listener_methods){
    events[method] = (function(list){
      return function(eventName, listener){
        if(typeof listener != "function"){
          return false;
        }
        if(!Array.isArray(list[eventName])){
          list[eventName] = [];
        }
        list[eventName].push(listener);
      };
    })(listener_methods[method]);
    };
  }

  // Generate remove methods

  const remove_methods = {
    remove_before: events.before_listeners,
    remove: events.listeners,
    remove_after: events.after_listeners
  };

  for(var method in remove_methods){
    events[method] = (function(list){
      return function(eventName, listener){
        if(Array.isArray(list[eventName])){
          var listeners = [];
          list[eventName].forEach(function(listenerMatch){
            if(listener != listenerMatch){
              listeners.push(listenerMatch);
            }
          });
          list[eventName] = listeners;
        }
      };
    })(remove_methods[method]);
  }

}

if(module){
  module.exports = Events;
}
