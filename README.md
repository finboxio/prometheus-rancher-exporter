# prometheus-rancher-exporter

Exposes the health of stacks/services and hosts from the Rancher API, to a Prometheus compatible endpoint.

## Description

This container makes use of Ranchers ability to assign API access to a container at runtime. This is achieved through labels to create a connection to the API.
The application, expects to get the following environment variables from the host, if not using the supplied labelss in rancher-compose then you can update these values yourself, using environment variables.

* CATTLE_ACCESS_KEY
* CATTLE_SECRET_KEY
* CATTLE_CONFIG_URL

## Metrics

Metrics will be made available on a random port by default, or you can pass environment variable ```PORT``` to override this.

```
# HELP rancher_environment_health Value of 1 if the environment is healthy
# TYPE rancher_environment_health gauge
rancher_environment_health{environment="test1"} 1
rancher_environment_health{environment="test2"} 0
rancher_environment_health{environment="load_test"} 1
rancher_environment_health{environment="preprod"} 1
```

```
# HELP rancher_host_health Value of 1 if the host is active
# TYPE rancher_host_health gauge
rancher_host_health{environment="Default" host="host1"} 1
rancher_host_health{environment="Default" host="host2"} 0
```

```
# HELP rancher_stack_health Value of 1 if all containers in a stack are active
# TYPE rancher_stack_health gauge
rancher_stack_health{environment="Default" stack="stack1"} 1
rancher_stack_health{environment="Default" stack="stack2"} 0
```

```
# HELP rancher_service_health Value of 1 if all containers in a service are active
# TYPE rancher_service_health gauge
rancher_service_health{environment="Default" stack="stack1" service="service1"} 1
rancher_service_health{environment="Default" stack="stack1" service="service2"} 0
```

