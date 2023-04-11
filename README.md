# grafana-demo

This project is to demonstrate the "simplest thing that works" to collect metrics AND tracing data for a simple Express application with a React client using Grafana.

It instruments an OTEL exporter with `tracing.ts`.  This file only needs to be required at runtime (see 'start' script in package.json).  It also requires some environment variables to be set (see example.env).

It provides a `/metrics` endpoint to expose Prometheus metrics via prom-client.  Note: this will need to be hidden from external access.

It serves a basic React app instrumented using Faro.  This client should probably send its metrics back to our internal collector via a reverse proxy (e.g. `[my-domain]/`) so that the app-key is not exposed

Some example code used from [prom-client](https://github.com/siimon/prom-client)

## Grafana Agent

On a Mac, the Grafana Agent can be installed with Homebrew: `brew install grafana-agent`

The configuration file, `/opt/homebrew/etc/grafana-agent/config.yml`, must include a target for this service to scrape its metrics.  Like so:

```yaml
metrics:
  wal_directory: /tmp/wal
  global:
    remote_write:
      - url: https://my-internal-collector:4317   # this doesn't work yet
    scrape_interval: 60s
  configs:
    - name: local
      scrape_configs:
        - job_name: local/grafana-demo
          static_configs:
            - targets: ['localhost:8080']
```

The error log for this agent is at `/opt/homebrew/var/log/grafana-agent.err.log` (if not, check `brew --prefix`)

## Faro

The application is created at `https://[account].grafana.net/a/grafana-kowalski-app/apps` and the `app-key` can be found on its configuration page.

The script to initialize Faro in the browser is currently commented out because adding `http://localhost:8080` to "CORS Allowed Origins" on the settings tab doesn't seem to work.  Perhaps "localhost" isn't allowed?

## TODO

Fix Faro setup: Getting CORS errors -- is localhost allowed?

Add specific support for Express (see [opentelemetry-instrumentation-express](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node/opentelemetry-instrumentation-express)) to collect metrics for handlers and middlewares.
