#!/usr/bin/env python3
"""将技能内的完整页面或React模块复制到指定的新目录，不修改已有工程文件。"""

import argparse
import shutil
import sys
from enum import Enum
from pathlib import Path


class CopyMode(str, Enum):
    """定义完整项目与独立React模块两种源码输出方式。

    @author 程序员阿鑫
    """

    STANDALONE = "standalone"
    MODULE = "module"


def parse_arguments():
    """读取复制模式、目标新目录与仅查看计划选项，返回解析后的命名空间。"""
    # 命令行参数只控制本地复制，没有安装依赖或执行目标代码的隐式步骤。
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mode", choices=[mode.value for mode in CopyMode], required=True)
    parser.add_argument("--target", type=Path, required=True, help="尚不存在的新目录")
    parser.add_argument("--dry-run", action="store_true", help="仅显示复制计划，不创建目录")
    return parser.parse_args()


def copy_template(mode, target, dry_run):
    """复制指定模式的模板到新路径，返回最终目录。

    Args:
        mode: CopyMode枚举值。
        target: 用户选择的输出路径。
        dry_run: 为真时只输出计划，不写入文件。
    """
    # 资源总是相对脚本定位，技能整个文件夹搬到其他机器后无需修改绝对路径。
    skill_directory = Path(__file__).resolve().parents[1]
    source = skill_directory / "assets" / "template"
    if mode == CopyMode.MODULE:
        source = source / "src" / "swarm"
    requested_target = target.expanduser().absolute()
    if requested_target.exists() or requested_target.is_symlink():
        raise ValueError(f"目标已经存在，未覆盖任何文件：{requested_target}")
    destination = requested_target.resolve()
    if destination == skill_directory or skill_directory in destination.parents:
        raise ValueError("输出目录不能放在技能包内部，以免把模板复制进自身。")
    if not source.is_dir():
        raise ValueError(f"模板资源缺失：{source}")
    # 不接收外部符号链接资源，确保迁移内容完全来自可携带的技能文件夹。
    entries = list(source.rglob("*"))
    if any(entry.is_symlink() for entry in entries):
        raise ValueError("模板中存在符号链接，请先修复技能资源后再复制。")
    file_count = sum(entry.is_file() for entry in entries)
    print(f"模式：{mode.value}\n来源：{source}\n目标：{destination}\n文件数：{file_count}")
    if dry_run:
        print("仅查看计划，没有创建或修改文件。")
        return destination
    # copytree默认拒绝已有目标，第二次调用也不会覆盖首次生成的源码。
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source, destination)
    print("复制完成。请按references/integration.md接入；未安装依赖或运行构建。")
    return destination


def main():
    """执行本地模板复制，并将失败原因以简短中文信息返回给调用者。"""
    # 保留非零退出码，便于代理识别复制未完成，而不是继续操作半成品目录。
    arguments = parse_arguments()
    try:
        copy_template(CopyMode(arguments.mode), arguments.target, arguments.dry_run)
    except (OSError, ValueError) as error:
        print(f"复制停止：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
