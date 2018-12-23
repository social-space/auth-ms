Identity Microservice
---------------------

Right now just pointing at Auth0. The sole purpose of this service is to be a central 
point for identity management. Not user management. So, effectively,
"this person is identified as `49ccbb23-bdb8-4f19-86d5-fa62f8432629`". From there we 
can latch users and other things on to this identity, and the details about how the 
identity was authenticated and the context information are fully hidden from the other
systems. 

At time of writing, the URL of interest is:

/auth/auth0/login

From there, you should be forwarded to Auth0, and upon login, sent back to the
callback URL which will display your JWT that can be used for development. 

To run, you need a couple things defined in your `local.yaml` file.

First, generate a public/private key.

1) `openssl ecparam -name prime256v1 -genkey -noout -out ecprivkey.pem`
2) `openssl ec -in ecprivkey.pem -pubout -out ecpubkey.pem`

Copy the public/private portions into the appropriate spot in the config file. Keep
the public portion around to give to the other services. 

Next up, you need access to the clientId and clientSecret for Auth0, as well as 
any changes that might need to be done to the callback url. 

```yaml
auth:
  Auth0:
    domain: socialspace.auth0.com
    clientId: <<CLIENT ID>>
    clientSecret: <<CLIENT SECRET>>
    callbackUrl: http://localhost:5000/auth/auth0/callback

keys:
  jwt:
    public: |
      -----BEGIN PUBLIC KEY-----
      <<<< PUBLIC KEY >>>>>
      -----END PUBLIC KEY-----
    private: |
      -----BEGIN EC PRIVATE KEY-----
      <<<< PRIVATE KEY >>>>
      -----END EC PRIVATE KEY-----
```