import { Meteor } from 'meteor/meteor';
import { Links} from "../imports/collections/links";
import {WebApp} from "meteor/webapp";
import ConnectRoute from "connect-route";


Meteor.startup(() => {
  Meteor.publish("links", function() {
    return Links.find({});
  });
});

// execute when user visits with a route like localhose:3000/abcd
function onRoute (req, res, next) {
  // take token and try to find link, if we find link redirect user to URL, if not reutrn to react app
    const link = Links.findOne({token:req.params.token});

    if (link) {
      Links.update(link, {$inc: {clicks:1}});
      res.writeHead( 307, { "Location": link.url});
      res.end();
    }
    else {
      next();
    }
}


  const middleware = ConnectRoute(function(router) {
    router.get("/:token", onRoute);
  });


WebApp.connectHandlers.use(middleware);
