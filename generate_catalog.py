import os
import json
import yaml
import markdown

# Настройки
CONTENT_DIR = 'content/products'
OUTPUT_FILE = 'data/catalog.json'

def parse_markdown(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Разделение YAML-заголовка и Markdown-контента
    if content.startswith('---'):
        parts = content.split('---', 2)
        metadata = yaml.safe_load(parts[1])
        # body = markdown.markdown(parts[2]) # Оставим как текст
        metadata['description'] = parts[2].strip()
        return metadata
    return None

def generate_catalog():
    products = []
    if not os.path.exists(os.path.dirname(OUTPUT_FILE)):
        os.makedirs(os.path.dirname(OUTPUT_FILE))
        
    for filename in os.listdir(CONTENT_DIR):
        if filename.endswith('.md'):
            product = parse_markdown(os.path.join(CONTENT_DIR, filename))
            if product:
                products.append(product)
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    generate_catalog()
    print(f'Каталог успешно собран в {OUTPUT_FILE}')
