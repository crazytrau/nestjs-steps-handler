# nestjs-steps-handler
Nestjs bullmq +  rabbittmq + redis full example


```sh
./start.sh
```

```sh
curl -X POST http://localhost:3816/jobs/enqueue -H "Content-Type: application/json" -d '{"id": "value", "data": {}}'
```