# Smart Resource Allocation System — Backend

## Quick Start

```bash
npm install
npm run dev       # development (auto-reload)
npm start         # production
```

## API Endpoints

| Method | Endpoint                    | Description                      |
|--------|-----------------------------|----------------------------------|
| GET    | /resources                  | List all resources               |
| GET    | /resources?status=available | Filter by status                 |
| POST   | /resources                  | Add a new resource               |
| PATCH  | /resources/:id/status       | Update resource status           |
| POST   | /request                    | Create a new request             |
| GET    | /request                    | List all requests                |
| POST   | /allocate                   | Allocate best resource to request|
| PATCH  | /allocate/:id/complete      | Mark allocation as completed     |
| GET    | /allocate                   | List all allocations             |

## Sample Request Bodies

### POST /request
```json
{
  "location": "Connaught Place, Delhi",
  "lat": 28.6315,
  "lng": 77.2167,
  "severity": "high",
  "description": "Cardiac emergency",
  "type": "Ambulance"
}
```

### POST /allocate
```json
{ "requestId": "REQ-12345" }
```

## Deploy on Render
1. Push to GitHub
2. New Web Service → connect repo
3. Build: `npm install`, Start: `npm start`
4. Add env var: PORT=5000
