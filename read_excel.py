import pandas as pd
import json

# Чтение Excel-файла
excel_file = 'maket.xlsx'
xls = pd.ExcelFile(excel_file)

# Вывод списка листов
print("Листы в Excel-файле:")
for sheet_name in xls.sheet_names:
    print(f"- {sheet_name}")

# Чтение данных из листа "КОНТЕЙНЕРНЫЕ СВЕЧИ"
try:
    container_candles = pd.read_excel(excel_file, sheet_name="КОНТЕЙНЕРНЫЕ СВЕЧИ")
    print("\nДанные из листа КОНТЕЙНЕРНЫЕ СВЕЧИ:")
    print(container_candles.head())
except Exception as e:
    print(f"Ошибка при чтении листа КОНТЕЙНЕРНЫЕ СВЕЧИ: {e}")

# Чтение данных из листа "ФОРМОВЫЕ СВЕЧИ"
try:
    shaped_candles = pd.read_excel(excel_file, sheet_name="ФОРМОВЫЕ СВЕЧИ")
    print("\nДанные из листа ФОРМОВЫЕ СВЕЧИ:")
    print(shaped_candles.head())
except Exception as e:
    print(f"Ошибка при чтении листа ФОРМОВЫЕ СВЕЧИ: {e}")

# Чтение данных из листа "АРОМАТЫ" и сохранение в JSON
try:
    fragrances = pd.read_excel(excel_file, sheet_name="АРОМАТЫ")
    print("\nДанные из листа АРОМАТЫ:")
    print(fragrances.head())
    
    # Преобразование данных в список для JSON
    fragrances_list = fragrances.iloc[:, 0].dropna().tolist()
    
    # Сохранение списка ароматов в JSON-файл
    with open('data/fragrances.json', 'w', encoding='utf-8') as f:
        json.dump(fragrances_list, f, ensure_ascii=False, indent=4)
    
    print(f"Список ароматов сохранен в data/fragrances.json")
    
    # Также сохраним список ароматов в текстовый файл для совместимости
    with open('data/fragrances.txt', 'w', encoding='utf-8') as f:
        for fragrance in fragrances_list:
            f.write(f"{fragrance}\n")
    
    print(f"Список ароматов сохранен в data/fragrances.txt")
except Exception as e:
    print(f"Ошибка при чтении листа АРОМАТЫ: {e}")

# Чтение данных из листа "ИНСТРУКЦИИ ДЛЯ ПРОДУКЦИИ"
try:
    instructions = pd.read_excel(excel_file, sheet_name="ИНСТРУКЦИИ ДЛЯ ПРОДУКЦИИ")
    print("\nДанные из листа ИНСТРУКЦИИ ДЛЯ ПРОДУКЦИИ:")
    print(instructions.head())
except Exception as e:
    print(f"Ошибка при чтении листа ИНСТРУКЦИИ ДЛЯ ПРОДУКЦИИ: {e}")

# Чтение данных из листа "СРОК ПРОИЗВОДСТВА"
try:
    production_time = pd.read_excel(excel_file, sheet_name="СРОК ПРОИЗВОДСТВА")
    print("\nДанные из листа СРОК ПРОИЗВОДСТВА:")
    print(production_time.head())
except Exception as e:
    print(f"Ошибка при чтении листа СРОК ПРОИЗВОДСТВА: {e}")

# Чтение данных из листа "Сотрудничество"
try:
    collaboration = pd.read_excel(excel_file, sheet_name="Сотрудничество")
    print("\nДанные из листа Сотрудничество:")
    print(collaboration.head())
except Exception as e:
    print(f"Ошибка при чтении листа Сотрудничество: {e}")