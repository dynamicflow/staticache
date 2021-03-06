# staticache
Is a microservice to help create a central static file store to facilitate caching in browser and cdn.

## Install

### Install Server

Run the following in order to install the server
``` bash
$ npm install 
$ npm start
```

### Install Client

Run the following in order to install the command line interface
``` bash
$ npm install -g 
```

### Install Samples

``` bash
$ staticache --resize 160x160,320x320 samples
$ open http://localhost:8080/static/samples/index.html
```

## Upload

### Upload a regular file

Uploads a regular file such as css or javascript

curl --form file=@samples/index.html --form path=samples/index.html  http://localhost:8080/cache
              
``` bash
$ curl --form file=@samples/bootstrap.css    \
       --form path=samples/bootstrap.css  \
              http://localhost:8080/cache
```

```json
{
  "content_type":"application/octet-stream",
  "path":"samples/bootstrap.min.css",
  "id":"6527d8bf3e1e9368bab8c7b60f56bc01fa3afd68",
  "size":121200
}
```

### Upload a image file
Uploads a image file such as jpg, gif and png

Whenever you upload an image, it is possible to generate scaled versions automatically.

``` bash
$ curl --form file=@samples/image.jpg     \
       --form path=samples/image.jpg      \
       --form scale=120x120,240x240,450x450
              http://localhost:8080/cache
```
the response will be something similar to:
```json
{
	"content_type":"image/jpeg",
	"path":"samples/49620.jpg",
	"width":900,
	"height":900,
	"id":"c7ffcc4f56cfbbf8887b9424c7c4923d3d7e90aa",
	"size":512260,
	"scaled":[
		{
			"id":"0c6ceeb8fd9f88b124de5b68e03d76ddecb7f112",
			"width":450,
			"height":450,
			"size":31443
		},{
			"id":"63abb6b1c53f9ca60797af424876c99f87aba312",
			"width":120,
			"height":120,
			"size":3355
		},{
			"id":"bd9a092087121abb759f22691494e0d0ce5e9f39",
			"width":240,
			"height":240,
			"size":10262
		}
	]
}
```

## Upload using command line tool
We created a simple command line tool that can be used to batch upload files


# Download

## Using caching interface
Use regular http get such as:

``` bash
curl http://localhost:8080/cache/c7ffcc4f56cfbbf8887b9424c7c4923d3d7e90aa
```
## Using static path

``` bash
curl http://localhost:8080/static/samples/49620.jpg
```
optionally you can specify the **scale** parameter in order to retrieve a particular size.
``` bash
curl http://localhost:8080/static/samples/49620.jpg?scale=120x120
```

# Docker

## Package 

``` bash
$ docker build -t dynamicflow/staticache .

$ docker volume create  --name staticache-data

$ docker run -i --add-host=mysql-server:10.0.1.17 --name staticache \
    --env "STATICACHE_DB=mysql://test:test@mysql-server:3306/test" \
    -v staticache-data:/var/lib/staticache \
    -p 8080:8080 \
    -t dynamicflow/staticache 
```

## Remove 

``` bash
$ docker stop staticache

$ docker rm staticache

```

docker run -i --name staticache \
    --env "STATICACHE_DB=mysql://gateway:6cw-mkv-78q-63z@iot-dev-db.cqj0hjperufd.us-east-1.rds.amazonaws.com:3306/oneflow" \
    -v staticache-data:/var/lib/staticache \
    -p 8080:8080 \
    -t dynamicflow/staticache 
