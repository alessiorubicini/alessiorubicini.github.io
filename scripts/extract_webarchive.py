import plistlib
import os
import sys

def extract_webarchive(archive_path, output_dir):
    with open(archive_path, 'rb') as f:
        try:
            archive = plistlib.load(f)
        except Exception as e:
            print(f"Error loading plist: {e}")
            return
            
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract main resource
    main_resource = archive.get('WebMainResource')
    if main_resource:
        data = main_resource.get('WebResourceData')
        mime_type = main_resource.get('WebResourceMIMEType', '')
        url = main_resource.get('WebResourceURL', '')
        print(f"Main Resource: URL={url}, MIME={mime_type}, Size={len(data) if data else 0}")
        
        # Save main resource
        if data:
            ext = '.html' if 'html' in mime_type else '.txt'
            out_path = os.path.join(output_dir, f"index{ext}")
            with open(out_path, 'wb') as out_f:
                out_f.write(data)
            print(f"Saved main resource to {out_path}")
            
    # Extract subresources
    subresources = archive.get('WebSubresources', [])
    print(f"Found {len(subresources)} subresources.")
    for idx, sub in enumerate(subresources):
        data = sub.get('WebResourceData')
        mime_type = sub.get('WebResourceMIMEType', '')
        url = sub.get('WebResourceURL', '')
        
        if not data:
            continue
            
        # Determine clean name/path based on URL
        # e.g., http://example.com/css/style.css -> css/style.css
        # Remove query params or hashes
        clean_url = url.split('?')[0].split('#')[0]
        # Get path after domain or domain itself
        parts = clean_url.split('/')
        if len(parts) > 3:
            rel_path = '/'.join(parts[3:])
        else:
            rel_path = parts[-1] if parts else f"subresource_{idx}"
            
        if not rel_path or rel_path.endswith('/'):
            rel_path = rel_path + f"index_{idx}"
            
        # Avoid directory traversal
        rel_path = rel_path.lstrip('/')
        target_path = os.path.join(output_dir, rel_path)
        
        # Create directories if needed
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        
        try:
            with open(target_path, 'wb') as out_f:
                out_f.write(data)
            print(f"Saved subresource: {url} -> {target_path}")
        except Exception as e:
            print(f"Failed to save {url} to {target_path}: {e}")

if __name__ == '__main__':
    archive_path = "inspiration/Himanshu Maurya.webarchive"
    output_dir = "inspiration/extracted"
    extract_webarchive(archive_path, output_dir)
