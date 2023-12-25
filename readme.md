<h4>Cloudinary response after uploading image</h4>
<pre id="readme-text">
    "avatarPath": {
            "asset_id": "54e9b134189e3a2a4e8f68754a352962",
            "public_id": "eousmcdzgxy5svf68wt1",
            "version": 1703492221,
            "version_id": "047d209748522b42c1aea1bbf830bb98",
            "signature": "7b8b2687d6bcea202f90d98e9bef72eefa01745f",
            "width": 360,
            "height": 326,
            "format": "png",
            "resource_type": "image",
            "created_at": "2023-12-25T08:17:01Z",
            "tags": [],
            "bytes": 48983,
            "type": "upload",
            "etag": "6110ec705c340982c15b0db33da864d8",
            "placeholder": false,
            "url": "http://res.cloudinary.com/dyad3bbxr/image/upload/v1703492221/eousmcdzgxy5svf68wt1.png",
            "secure_url": "https://res.cloudinary.com/dyad3bbxr/image/upload/v1703492221/eousmcdzgxy5svf68wt1.png",
            "folder": "",
            "original_filename": "1703492220331-437118580_spider",
            "api_key": "436838568172322"
        }
</pre> 

<h4>Multer:- After receiving image in avatar key</h4>
<pre id="readme-text">
{
    avatar: [
        {
        fieldname: 'avatar',
        originalname: 'spider.png',
        encoding: '7bit',
        mimetype: 'image/png',
        destination: './public/temp',
        filename: '1703492220331-437118580_spider.png',
        path: 'public/temp/1703492220331-437118580_spider.png',
        size: 48983
        }
    ]
}
</pre> 