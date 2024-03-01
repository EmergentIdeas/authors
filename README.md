# Add author to a webhandle environment

## Install

```
npm install @dankolz/authors
```

Add to less: 
```
@import "../node_modules/@dankolz/authors/less/components";
```

Add to client js:

```
let clientIntegrator = require('@dankolz/authors').default
clientIntegrator()
```

Add to server js:
```
const serverIntegrator = (await import('@dankolz/authors')).default
serverIntegrator(dbName)
```

By default, the urls are:

/admin/author

Services are:
- author
