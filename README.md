# nestjs-steps-handler
Nestjs To handle job state management in a system using Bull (a popular job and queue library for Node.js), Amazon SQS (Simple Queue Service), RabbitMQ, and Redis, you'll need to set up a solution that ensures job steps do not repeat and can be resumed if triggered again.


```sh
./start.sh
```

```sh
curl -X POST http://localhost:3816/jobs/enqueue -H "Content-Type: application/json" -d '{"id": "value", "data": {}}'
```