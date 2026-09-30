import { App, redirect, session } from "@elements/app";
import config from "#config";
import signin from "#app/pages/signin";
import signup from "#app/pages/signup";
import lists from "#app/pages/lists";
import chores from "#app/pages/chores";
import meals from "#app/pages/meals";
import household from "#app/pages/household";
import notFound from "#app/pages/errors/not-found";
import unhandled from "#app/pages/errors/unhandled";

const app = new App();

app.route("/", () => {
  redirect(session.isLoggedIn() ? "/lists" : "/signin");
});

app.route("/signin", signin);
app.route("/signup", signup);
app.route("/join/:token", (req) => {
  redirect(`/signup?invite=${encodeURIComponent(req.params.token)}`);
});

app.route("/lists", lists);
app.route("/lists/:id", lists);
app.route("/chores", chores);
app.route("/meals", meals);
app.route("/household", household);

app.error((req, res, err) => {
  switch (err.statusCode) {
    case 404:
      return notFound(req, res, err);

    default:
      return unhandled(req, res, err);
  }
});

app.start(config);
