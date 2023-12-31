## Yêu cầu

Docker: [Link download](https://docs.docker.com/get-docker/?_gl=1*1xhxam0*_ga*MTM5NzIwNjU3MC4xNzA0MDIzMzg0*_ga_XJWPQMJYHQ*MTcwNDAyMzM4My4xLjEuMTcwNDAyMzM5NS40OC4wLjA.)
## Chạy dự án

1. Chạy backend(django) bằng câu lệnh
```
docker-compose -f local.yml up django-qltd
```

2. Chạy frontend(reactjs)

- Download và cài đặt nodejs(version `14.21.1`), npm [link](https://nodejs.org/en/about/previous-releases_)
- Vô thư mục `fe_app/`
- Chạy lệnh `npm install`
- Chạy lệnh `npm start`

## Deployment flow

Hiện tại dự án đang được deploy theo các bước sau
1. Push code lên github
2. Github action được trigger và chạy theo các bước trong file `github-action.yml`
- Build image
- Push image lên docker hub
- Remote lên server và pull image về
- Chạy docker
